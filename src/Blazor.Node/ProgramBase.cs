using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace Blazor.Node
{
    public abstract class ProgramBase
    {
        protected async Task BaseMain()
        {
            var builder = WebAssemblyHostBuilder.CreateDefault();
            Configuration = builder.Configuration;
            ConfigureServices(builder.Services);

            var host = builder.Build();
            var jsRuntime = (IJSInProcessRuntime)host.Services.GetService<IJSRuntime>();
            var logger = host.Services.GetService<ILogger<ProgramBase>>();

            try
            {
                await Execute(host.Services).ConfigureAwait(false);
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "An unhandled exception was thrown from program execution.");
            }
            jsRuntime.InvokeVoid("BlazorEnd");
        }

        protected IConfiguration Configuration { get; private set; }
        public abstract void ConfigureServices(IServiceCollection services);
        public abstract Task Execute(IServiceProvider serviceProvider);
    }
}
