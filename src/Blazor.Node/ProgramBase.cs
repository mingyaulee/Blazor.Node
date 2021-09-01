using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

            await Execute(host.Services);
            jsRuntime.InvokeVoid("BlazorEnd");
        }

        protected IConfiguration Configuration { get; private set; }
        public abstract void ConfigureServices(IServiceCollection services);
        public abstract Task Execute(IServiceProvider serviceProvider);
    }
}
